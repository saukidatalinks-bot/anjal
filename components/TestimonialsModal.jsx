'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function TestimonialsModal({ isOpen, onClose }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    rating: 5,
    is_approved: false
  })
  const [submitting, setSubmitting] = useState(false)

  // Fetch all testimonials
  useEffect(() => {
    if (isOpen) {
      fetchTestimonials()
    }
  }, [isOpen])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTestimonial = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Name, email, and message are required')
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`/api/admin/testimonials/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            role: formData.role,
            message: formData.message,
            rating: formData.rating,
            is_approved: formData.is_approved
          })
        })

        if (!res.ok) throw new Error('Failed to update')
        toast.success('Testimonial updated!')
      } else {
        // Create new
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error('Failed to create')
        toast.success('Testimonial created!')
      }

      resetForm()
      fetchTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error(editingId ? 'Failed to update testimonial' : 'Failed to create testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (testimonial) => {
    setFormData(testimonial)
    setEditingId(testimonial.id)
    setShowAddForm(true)
  }

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Testimonial deleted!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  const togglePublish = async (id, currentStatus) => {
    try {
      const testimonial = testimonials.find(t => t.id === id)
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testimonial, is_approved: !currentStatus })
      })

      if (!res.ok) throw new Error('Failed to update')
      toast.success(currentStatus ? 'Testimonial unpublished' : 'Testimonial published!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error toggling publish:', error)
      toast.error('Failed to update testimonial status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      role: '',
      message: '',
      rating: 5,
      is_approved: false
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto max-w-3xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy">Manage Testimonials</h2>
            <p className="text-sm text-slate-500 mt-1">Create, edit, and publish customer testimonials</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-navy mb-4">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <form onSubmit={handleSaveTestimonial} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Role/Position"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <textarea
                  placeholder="Testimonial message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Rating (1-5):</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_approved}
                      onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-600">Publish immediately</span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              + Add New Testimonial
            </button>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-navy">{testimonials.length}</div>
              <div className="text-xs text-slate-500">Total Testimonials</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{testimonials.filter(t => t.is_approved).length}</div>
              <div className="text-xs text-slate-500">Published</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{testimonials.filter(t => !t.is_approved).length}</div>
              <div className="text-xs text-slate-500">Pending</div>
            </div>
          </div>

          {/* Testimonials List */}
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No testimonials yet. Create your first one!</div>
          ) : (
            <div className="space-y-3">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="p-4 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-navy">{testimonial.name}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{'⭐'.repeat(testimonial.rating)}</span>
                        {testimonial.is_approved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Published</span>}
                        {!testimonial.is_approved && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Pending</span>}
                      </div>
                      {testimonial.company && <div className="text-xs text-slate-500">{testimonial.company} · {testimonial.role}</div>}
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{testimonial.message}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => togglePublish(testimonial.id, testimonial.is_approved)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                          testimonial.is_approved
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {testimonial.is_approved ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
