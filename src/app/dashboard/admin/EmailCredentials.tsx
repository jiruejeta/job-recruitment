'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Search, X, User, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export default function SendCredentials() {
  const [searchMethod, setSearchMethod] = useState<'name' | 'id'>('name')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [emailSubject, setEmailSubject] = useState('Your Login Credentials - MINT Internship Portal')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Fetch users on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      return
    }

    const filtered = users.filter(user => {
      if (searchMethod === 'name') {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase())
      } else {
        return user.id.toLowerCase().includes(searchTerm.toLowerCase())
      }
    })

    setSearchResults(filtered.slice(0, 5)) // Limit to 5 results
  }, [searchTerm, searchMethod, users])

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    }
    setSearchTerm('')
    setSearchResults([])
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId))
  }

  const handleClearSelection = () => {
    setSelectedUsers([])
  }

  const handleSendCredentials = async () => {
    if (selectedUsers.length === 0) return
    
    setIsSending(true)
    try {
      const response = await fetch('/api/send-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers.map(user => user.id),
          subject: emailSubject
        })
      })

      if (response.ok) {
        setSendSuccess(true)
        setSelectedUsers([])
        setTimeout(() => setSendSuccess(false), 3000)
      } else {
        throw new Error('Failed to send credentials')
      }
    } catch (error) {
      console.error('Error sending credentials:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Send Login Credentials</h2>
        <p className="text-[#6B7280]">Send login credentials to employees via email</p>
      </div>

      {/* Email Form */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-[#087684] to-[#066466]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Send Credentials</h3>
              <p className="text-white/80 text-sm">Send login credentials to selected users</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Selection */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#1C1C1E] mb-6">Select Recipients</h4>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Search Method</label>
                    <div className="relative">
                      <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200 appearance-none cursor-pointer flex justify-between items-center"
                      >
                        <span>{searchMethod === 'name' ? 'Search by Name' : 'Search by Employee ID'}</span>
                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#E5E7EB]"
                          >
                            <button
                              onClick={() => {
                                setSearchMethod('name')
                                setDropdownOpen(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-[#F9FAFB]"
                            >
                              Search by Name
                            </button>
                            <button
                              onClick={() => {
                                setSearchMethod('id')
                                setDropdownOpen(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-[#F9FAFB]"
                            >
                              Search by Employee ID
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#374151] mb-2">Search Term</label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Enter ${searchMethod === 'name' ? 'name' : 'employee ID'}...`}
                        className="w-full pl-10 pr-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                      />
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-[#E5E7EB] max-h-60 overflow-auto">
                        {searchResults.map(user => (
                          <div
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer flex items-center"
                          >
                            <div className="w-8 h-8 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-3">
                              <User size={16} className="text-[#087684]" />
                            </div>
                            <div>
                              <div className="font-medium text-[#1C1C1E]">{user.name}</div>
                              <div className="text-sm text-[#6B7280]">{user.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#1C1C1E] mb-6">Email Settings</h4>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Email Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Your Login Credentials - MINT Internship Portal"
                      className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Users Preview */}
          <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
            <h4 className="text-lg font-medium text-[#1C1C1E] mb-4">Selected Recipients</h4>
            <div className="bg-[#FAFBFC] rounded-xl p-4">
              {selectedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Mail size={48} className="text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280] text-sm">No users selected yet. Use the search above to find recipients.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-3">
                          <User size={16} className="text-[#087684]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#1C1C1E]">{user.name}</div>
                          <div className="text-sm text-[#6B7280]">{user.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-[#6B7280] hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F1F5F9]">
            <button
              onClick={handleClearSelection}
              disabled={selectedUsers.length === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                selectedUsers.length === 0
                  ? 'text-[#9CA3AF] bg-[#F8F9FA] cursor-not-allowed'
                  : 'text-[#6B7280] bg-[#F8F9FA] hover:bg-[#E9ECEF]'
              }`}
            >
              Clear Selection
            </button>
            <div className="flex space-x-3">
              <AnimatePresence>
                {sendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center px-4 bg-green-50 text-green-700 rounded-lg"
                  >
                    <Check size={16} className="mr-2" />
                    <span>Credentials sent successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={handleSendCredentials}
                disabled={selectedUsers.length === 0 || isSending}
                className={`px-8 py-3 bg-gradient-to-r from-[#087684] to-[#066466] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center ${
                  selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Credentials'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}