'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, User, AtSign, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ui/ParticlesBackground'
import { createClient } from '@/lib/supabase/client'
import { footerData as staticFooterData, servicesData as staticServicesData } from '@/lib/data/index'

export default function ContactPage() {
  const [layoutData, setLayoutData] = useState<any>({
    footer: {
      siteName: staticFooterData.siteName,
      tagline: staticFooterData.tagline,
      companyDescription: staticFooterData.companyDescription,
      siteLogo: staticFooterData.siteLogo,
      siteLogoLight: staticFooterData.siteLogoLight,
      copyrightText: staticFooterData.copyrightText,
      contactEmail: staticFooterData.contactEmail,
      contactPhone: staticFooterData.contactPhone,
      address: staticFooterData.address,
      socialLinks: staticFooterData.socialLinks,
      menuItems: staticFooterData.menuItems,
      cta: staticFooterData.cta,
    },
    services: staticServicesData.map((s) => ({ title: s.title, link: s.link })),
  })
  
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      if (!supabase) return
      const [footerRes, servicesRes] = await Promise.all([
        supabase.from('footer').select('*').single(),
        supabase.from('services').select('*').order('order')
      ])
      
      // Transform footer data to match component expectations
      const footerData = footerRes.data ? {
        siteName: footerRes.data.site_name,
        tagline: footerRes.data.tagline,
        companyDescription: footerRes.data.company_description,
        siteLogo: footerRes.data.site_logo_url ? { asset: { url: footerRes.data.site_logo_url } } : undefined,
        siteLogoLight: footerRes.data.site_logo_light_url ? { asset: { url: footerRes.data.site_logo_light_url } } : undefined,
        copyrightText: footerRes.data.copyright_text,
        contactEmail: footerRes.data.contact_email,
        contactPhone: footerRes.data.contact_phone,
        address: footerRes.data.address,
        socialLinks: footerRes.data.social_links || [],
        menuItems: footerRes.data.menu_items || [],
        cta: footerRes.data.cta ? { label: footerRes.data.cta.label || footerRes.data.cta.text, href: footerRes.data.cta.href || footerRes.data.cta.link } : undefined,
      } : null
      
      // Transform services
      const servicesData = (servicesRes.data || []).map((s: any) => ({
        title: s.title,
        link: s.link || `/services/${s.slug}`
      }))
      
      setLayoutData({
        footer: footerData,
        services: servicesData
      })
    }
    fetchData()
  }, [])
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'contact@deepneurax.com',
      href: 'mailto:contact@deepneurax.com',
      description: 'Our friendly team is here to help.'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      description: 'Mon-Fri from 8am to 5pm.'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 AI Blvd, San Francisco, CA',
      href: '#',
      description: 'Come say hello at our office HQ.'
    },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      if (supabase) {
        const { error } = await supabase.from('contact_submissions').insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        })
        if (error) throw error
      }
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050b1f] overflow-hidden selection:bg-blue-500/30">
      <Header 
        logo={layoutData?.footer?.siteLogo}
        logoLight={layoutData?.footer?.siteLogoLight}
        siteName={layoutData?.footer?.siteName}
        menuItems={layoutData?.footer?.menuItems}
        cta={layoutData?.footer?.cta}
      />
      
      <main className="relative pt-24 pb-12 lg:pt-32 lg:pb-24">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {/* Particles */}
           <div className="absolute inset-0 opacity-40">
            <ParticlesBackground 
              color="#60a5fa" 
              linkColor="#3b82f6" 
              maxParticles={50} 
            />
          </div>

          {/* Glowing Blobs */}
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
                  Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Talk</span>
                </h1>
                <p className="text-xl text-blue-100/70 leading-relaxed max-w-lg">
                  Have a project in mind or want to explore how AI can transform your business? We're here to listen and build the future with you.
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <motion.a
                      key={index}
                      href={method.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                        <Icon className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                        <p className="text-blue-200 font-medium mb-0.5">{method.value}</p>
                        <p className="text-sm text-blue-100/50">{method.description}</p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-2xl -z-10 rounded-[3rem]" />
              
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] pointer-events-none" />

                <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Geom', sans-serif" }}>
                  Send us a Message
                </h2>

                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-blue-100/70">We'll get back to you within 24 hours.</p>
                      <button 
                        onClick={() => setSubmitStatus('idle')}
                        className="mt-8 px-6 py-2 text-sm text-blue-400 hover:text-white transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit} 
                      className="space-y-5"
                    >
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-100/80 ml-1">Your Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100/30 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-100/20 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-100/80 ml-1">Email Address</label>
                        <div className="relative group">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100/30 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-100/20 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-100/80 ml-1">Subject</label>
                        <div className="relative group">
                          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100/30 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Project Inquiry"
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-100/20 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-100/80 ml-1">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your project..."
                          rows={4}
                          required
                          className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-100/20 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {layoutData.footer && (
        <Footer 
          data={layoutData.footer} 
          services={layoutData.services} 
        />
      )}
    </div>
  )
}
