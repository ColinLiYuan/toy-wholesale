'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { blogAdminService } from '@/services';
import { BlogPost } from '@/types';
import { formatImageUrl } from '@/lib/api-config';
import MDEditor from '@uiw/react-md-editor';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;
  const isEditing = blogId !== 'new';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [blog, setBlog] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    isPublished: false,
    tags: [] as string[],
    authorName: '',
  });

  const [newTag, setNewTag] = useState('');

  // 加载博客数据（编辑模式）
  useEffect(() => {
    if (isEditing && blogId) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    setFetching(true);
    try {
      const blog = await blogAdminService.getBlogById(parseInt(blogId));
      
      // 解析 tags：后端返回 JSON 字符串，前端转为数组
      const parseTags = (tags: string | string[] | undefined): string[] => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        try {
          return JSON.parse(tags);
        } catch {
          return tags.split(',').filter(t => t.trim());
        }
      };
      
      const tagsArray = parseTags(blog.tags);
      
      setBlog({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || '',
        category: blog.category,
        isPublished: blog.isPublished || false,
        tags: tagsArray,
        authorName: blog.authorName || '',
      });
    } catch (error) {
      console.error('Failed to load blog:', error);
      alert('加载博客失败');
      router.push('/admin/blog');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 准备提交数据
      const submitData = {
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || undefined,
        category: blog.category,
        isPublished: blog.isPublished,
        // 注意：后端接收 JSON 字符串格式的 tags，但 TypeScript 类型定义为 string[]
        tags: JSON.stringify(blog.tags) as unknown as string[],
        authorName: blog.authorName || undefined,
      };

      console.log('Submitting blog data:', submitData);

      if (isEditing) {
        await blogAdminService.updateBlog(parseInt(blogId), submitData);
        alert('文章更新成功！');
      } else {
        await blogAdminService.createBlog(submitData);
        alert('文章保存成功！');
      }
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Failed to save blog:', error);
      console.error('Error response:', error.response?.data);
      alert('保存失败：' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 图片上传处理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/upload/blog', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.code === 200 && result.data) {
        setBlog({ ...blog, coverImage: result.data });
        alert('图片上传成功！');
      } else {
        alert('图片上传失败：' + result.message);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !blog.tags.includes(newTag.trim())) {
      setBlog({ ...blog, tags: [...blog.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setBlog({ ...blog, tags: blog.tags.filter(t => t !== tag) });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? '编辑文章' : '发布新文章'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? '修改博客文章内容' : '创建并发布博客文章'}
          </p>
        </div>
        <Link
          href="/admin/blog"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← 返回列表
        </Link>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="输入文章标题"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL 别名 (Slug) *
              </label>
              <input
                type="text"
                value={blogId !== 'new' ? blogId : ''}
                disabled={isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="如: my-blog-post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <input
                type="text"
                value={blog.category}
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="如: Technology, Security, Industry"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                摘要
              </label>
              <textarea
                value={blog.excerpt}
                onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="文章简短摘要"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片
              </label>
              <div className="flex gap-4">
                {blog.coverImage && (
                  <div className="relative w-32 h-32">
                    <img
                      src={formatImageUrl(blog.coverImage)}
                      alt="封面预览"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setBlog({ ...blog, coverImage: '' })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500">或输入图片 URL</p>
                  <input
                    type="text"
                    value={blog.coverImage}
                    onChange={(e) => setBlog({ ...blog, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作者
              </label>
              <input
                type="text"
                value={blog.authorName}
                onChange={(e) => setBlog({ ...blog, authorName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="作者名称"
              />
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">文章内容</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 * (支持 Markdown 格式)
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={blog.content}
                onChange={(value) => setBlog({ ...blog, content: value || '' })}
                height={500}
                preview="live"
                textareaProps={{
                  placeholder: '# 文章标题\n\n在此输入 Markdown 格式的内容...',
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              提示: 支持标准 Markdown 语法，包括表格、代码块、图片等
            </p>
          </div>
        </div>

        {/* 标签和状态 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="输入标签后按回车"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发布状态
              </label>
              <select
                value={blog.isPublished ? 'true' : 'false'}
                onChange={(e) => setBlog({ ...blog, isPublished: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="false">草稿</option>
                <option value="true">已发布</option>
              </select>
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/blog"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : isEditing ? '保存更改' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  );
}
