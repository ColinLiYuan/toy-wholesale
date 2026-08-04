'use client';

import { useState, useEffect } from 'react';
import { attachmentService } from '@/services';
import type { Attachment } from '@/services';

interface AttachmentManagerProps {
  entityType: 'INQUIRY' | 'LEAD' | 'SUPPLIER' | 'ORDER';
  entityId: number;
}

export default function AttachmentManager({ entityType, entityId }: AttachmentManagerProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [attachmentDescription, setAttachmentDescription] = useState('');
  const [bizType, setBizType] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = (attachment: Attachment) => {
    const ext = (attachment.fileExtension || '').toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
  };

  const bizTypeOptions = entityType === 'ORDER' ? [
    { value: '', label: '-- 业务类型 --' },
    { value: 'PI', label: 'PI (形式发票)' },
    { value: '订货合同', label: '订货合同' },
    { value: '采购单', label: '采购单' },
    { value: '付款水单', label: '付款水单' },
    { value: '唛头', label: '唛头' },
    { value: '提单', label: '提单' },
  ] : entityType === 'LEAD' ? [
    { value: '', label: '-- 业务类型 --' },
    { value: '报价单', label: '报价单' },
  ] : [];

  useEffect(() => {
    fetchAttachments();
  }, [entityType, entityId]);

  const fetchAttachments = async () => {
    try {
      const data = await attachmentService.getAttachments(entityType, entityId, 0, 100);
      setAttachments(data.content || []);
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await attachmentService.uploadAttachment(
          file,
          entityType,
          entityId,
          attachmentDescription || undefined,
          undefined, // uploadBy
          (entityType === 'ORDER' || entityType === 'LEAD') ? bizType || undefined : undefined
        );
      }
      setShowUploadForm(false);
      setAttachmentDescription('');
      fetchAttachments();
      alert('附件上传成功');
    } catch (error: any) {
      console.error('Failed to upload attachment:', error);
      alert('上传失败：' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (id: number, fileName: string) => {
    if (!confirm(`确定要删除附件 "${fileName}" 吗？`)) return;

    try {
      await attachmentService.deleteAttachment(id);
      fetchAttachments();
      alert('删除成功');
    } catch (error: any) {
      console.error('Failed to delete attachment:', error);
      alert('删除失败：' + error.message);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">附件 ({attachments.length})</h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          {showUploadForm ? '取消' : '上传附件'}
        </button>
      </div>

      {showUploadForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">上传附件</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">附件描述（可选）</label>
            <input
              type="text"
              value={attachmentDescription}
              onChange={(e) => setAttachmentDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              placeholder="请输入附件描述..."
            />
          </div>
          {entityType === 'ORDER' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">业务类型</label>
              <select value={bizType} onChange={(e) => setBizType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent">
                {bizTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
            <input
              type="file"
              multiple
              onChange={handleUploadAttachment}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
            />
            <p className="text-xs text-gray-500 mt-1">
              支持格式：图片、PDF、Word、Excel、文本、压缩包 | 单个文件最大 20MB
            </p>
          </div>
          {uploading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F2FE]"></div>
              <span className="ml-2 text-gray-600">上传中...</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">{attachment.fileName}</p>
                  {attachment.description && (
                    <p className="text-sm text-gray-600 mt-1">{attachment.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(attachment.fileSize)}</span>
                <span>{attachment.fileExtension.toUpperCase()}</span>
                {attachment.bizType && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{attachment.bizType}</span>}
                <span>{new Date(attachment.createdAt).toLocaleString('zh-CN')}</span>
                {attachment.uploadBy && <span>上传者：{attachment.uploadBy}</span>}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {isImage(attachment) && (
                <img src={attachment.fileUrl} alt={attachment.fileName}
                  className="w-10 h-10 object-cover rounded cursor-pointer border hover:opacity-80"
                  onClick={() => setPreviewUrl(attachment.fileUrl)} />
              )}
              <button
                onClick={() => attachmentService.downloadAttachment(attachment.id)}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载
              </button>
              <button
                onClick={() => handleDeleteAttachment(attachment.id, attachment.fileName)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          </div>
        ))}
        {attachments.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <p className="text-gray-500">暂无附件</p>
          </div>
        )}

      {/* 图片预览弹窗 */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="preview" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={() => setPreviewUrl(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">×</button>
        </div>
      )}
      </div>
    </div>
  );
}
