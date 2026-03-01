'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminTestimonials() {
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
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
      console.log(`Loaded ${data.testimonials?.length || 0} testimonials`)
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
      toast.error('Failed to save testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      email: testimonial.email,
      company: testimonial.company || '',
      role: testimonial.role || '',
      message: testimonial.message,
      rating: testimonial.rating || 5,
      is_approved: testimonial.is_approved || false
    })
    setEditingId(testimonial.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this testimonial?')) return

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Testimonial removed!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to remove testimonial')
    }
  }

  const handleToggleApproval = async (testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !testimonial.is_approved })
      })

      if (!res.ok) throw new Error('Failed to update')
      toast.success(testimonial.is_approved ? 'Testimonial unpublished' : 'Testimonial published!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error toggling approval:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black">Testimonials Manager</h1>
          <p className="text-gray-600 mt-1">Manage all client testimonials - add, edit, approve, or remove</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowAddForm(!showAddForm)
          }}
          className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {/* Add/Edit Testimonial Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <form onSubmit={handleSaveTestimonial} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Client name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title</label>
                <input
                  type="text"
                  placeholder="CEO, Founder, etc."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                required
                placeholder="What did they say about us?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★</option>
                  <option value={3}>3 Stars ★★★</option>
                  <option value={2}>2 Stars ★★</option>
                  <option value={1}>1 Star ★</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.is_approved ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, is_approved: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="false">Pending (Not Published)</option>
                  <option value="true">Published (Shows on Website)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">No testimonials yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900"
            >
              Add First Testimonial
            </button>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`border rounded-lg p-6 transition-all ${
                testimonial.is_approved
                  ? 'bg-green-50 border-green-300'
                  : 'bg-yellow-50 border-yellow-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-black text-lg">{testimonial.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        testimonial.is_approved
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {testimonial.is_approved ? '✓ Published' : '⏱ Pending'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {testimonial.role && <span>{testimonial.role}</span>}
                    {testimonial.company && <span>{testimonial.company}</span>}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed italic">"{testimonial.message}"</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleApproval(testimonial)}
                    className={`px-3 py-1 font-semibold rounded text-sm transition-colors ${
                      testimonial.is_approved
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {testimonial.is_approved ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="px-3 py-1 bg-blue-600 text-white font-semibold rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    ✎ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-3 py-1 bg-red-600 text-white font-semibold rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {testimonials.length > 0 && (
        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-black">{testimonials.length}</p>
            <p className="text-sm text-gray-600">Total Testimonials</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {testimonials.filter((t) => t.is_approved).length}
            </p>
            <p className="text-sm text-gray-600">Published</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {testimonials.filter((t) => !t.is_approved).length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
      )}
    </div>
  )
}
