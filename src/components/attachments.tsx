'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Paperclip, Upload, Download, Trash2, FileText, FileSpreadsheet, FileIcon, File as FilePdf } from 'lucide-react'
import type { Attachment } from '@/types'

interface AttachmentManagerProps {
  todoId: string
  attachments: Attachment[]
  onAttachmentAdded: (attachment: Attachment) => void
  onAttachmentDeleted: (attachmentId: string) => void
}

export function AttachmentManager({
  todoId,
  attachments,
  onAttachmentAdded,
  onAttachmentDeleted
}: AttachmentManagerProps) {
  const { token } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 根据文件类型获取图标
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-4 h-4 text-pink-600" />
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileIcon className="w-4 h-4 text-orange-600" />
    } else if (fileType === 'application/pdf') {
      return <FilePdf className="w-4 h-4 text-red-600" />
    } else if (fileType === 'text/plain') {
      return <FileText className="w-4 h-4 text-gray-600" />
    }
    return <Paperclip className="w-4 h-4 text-gray-600" />
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件类型
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('不支持的文件类型。请上传 Word、Excel、PowerPoint、TXT 或 PDF 文件。')
      return
    }

    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('todoId', todoId)

      const response = await fetch('/api/attachments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        onAttachmentAdded(result.attachment)

        // 清空文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorData = await response.json()
        alert(`上传失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件上传失败:', error)
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // 处理文件下载
  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(`/api/attachments/${attachment.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = attachment.originalName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const errorData = await response.json()
        alert(`下载失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件下载失败:', error)
      alert('下载失败，请重试')
    }
  }

  // 处理文件删除
  const handleDelete = async (attachment: Attachment) => {
    if (!confirm(`确定要删除文件 "${attachment.originalName}" 吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/attachments/${attachment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        onAttachmentDeleted(attachment.id)
      } else {
        const errorData = await response.json()
        alert(`删除失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  return (
    <div className="space-y-4">
      {/* 上传按钮 */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf"
          className="hidden"
          disabled={isUploading}
        />

        <Button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              添加附件
            </>
          )}
        </Button>

        <span className="text-sm text-gray-500">
          支持 Word、Excel、PowerPoint、TXT、PDF 格式，最大 10MB
        </span>
      </div>

      {/* 上传进度条 */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* 附件列表 */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(attachment.fileType)}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.fileSize)} •
                        {new Date(attachment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      onClick={() => handleDownload(attachment)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-pink-600 hover:bg-pink-50"
                      title="下载"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(attachment)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Paperclip className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="font-medium mb-2">暂无附件</p>
          <p className="text-sm">点击上方按钮为这个任务添加附件</p>
        </div>
      )}
    </div>
  )
}