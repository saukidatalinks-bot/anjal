'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminTestimonials() {
  const [pendingTestimonials, setPendingTestimonials] = useState([])
  const [approvedTestimonials, setApprovedTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [showAddForm, setShowAddForm] = useState(false)
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

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch('/api/admin/testimonials?status=pending'),
        fetch('/api/admin/testimonials?status=approved')
      ])

      const pending = await pendingRes.json()
      const approved = await approvedRes.json()

      setPendingTestimonials(pending.testimonials || [])
      setApprovedTestimonials(approved.testimonials || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: true })
      })

      if (!res.ok) throw new Error('Failed to approve')

      toast.success('Testimonial approved!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error approving testimonial:', error)
      toast.error('Failed to approve testimonial')
    }
  }

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to reject')

      toast.success('Testimonial rejected and removed')
      fetchTestimonials()
    } catch (error) {
      console.error('Error rejecting testimonial:', error)
      toast.error('Failed to reject testimonial')
    }
  }

  const handleAddTestimonial = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Name, email, and message are required')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create testimonial')

      toast.success('Testimonial created successfully!')
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        message: '',
        rating: 5,
        is_approved: false
      })
      setShowAddForm(false)
      fetchTestimonials()
    } catch (error) {
      console.error('Error creating testimonial:', error)
      toast.error('Failed to create testimonial')
    } finally {
      setSubmitting(false)
    }
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
          <h1 className="text-3xl font-semibold text-black">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage client testimonials and approvals</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {/* Add New Testimonial Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Add New Testimonial</h2>
          <form onSubmit={handleAddTestimonial} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Role/Title"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <textarea
              placeholder="Testimonial Message *"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.is_approved}
                  onChange={(e) => setFormData({ ...formData, is_approved: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value={false}>Pending</option>
                  <option value={true}>Approved</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Testimonial'}
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'text-black border-black'
              : 'text-gray-600 border-transparent hover:text-black'
          }`}
        >
          Pending ({pendingTestimonials.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'approved'
              ? 'text-black border-black'
              : 'text-gray-600 border-transparent hover:text-black'
          }`}
        >
          Approved ({approvedTestimonials.length})
        </button>
      </div>

      {/* Pending Testimonials */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingTestimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No pending testimonials to review
            </div>
          ) : (
            pendingTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border border-yellow-200 rounded-lg p-6 bg-yellow-50/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-black text-lg">{testimonial.name}</h3>
                    {testimonial.role && <p className="text-sm text-gray-600">{testimonial.role}</p>}
                    {testimonial.company && <p className="text-sm text-gray-500">{testimonial.company}</p>}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.message}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(testimonial.id)}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(testimonial.id)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Approved Testimonials */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          {approvedTestimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No approved testimonials yet
            </div>
          ) : (
            approvedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-black text-lg">{testimonial.name}</h3>
                    {testimonial.role && <p className="text-sm text-gray-600">{testimonial.role}</p>}
                    {testimonial.company && <p className="text-sm text-gray-500">{testimonial.company}</p>}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.message}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleReject(testimonial.id)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
