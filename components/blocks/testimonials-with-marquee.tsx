import React from 'react'
import { TestimonialCard, TestimonialAuthor } from '@/components/ui/testimonial-card'

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

const cn = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(' ')

export function TestimonialsSection({ title, description, testimonials, className }: TestimonialsSectionProps) {
  const hasTestimonials = Array.isArray(testimonials) && testimonials.length > 0

  return (
    <section
      className={cn(
        'bg-white text-gray-900',
        'py-12 sm:py-20 md:py-28 px-0',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:gap-12 px-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[640px] font-medium text-gray-600 sm:text-xl">
            {description}
          </p>
        </div>

        {hasTestimonials && (
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
            {/* Row 1: normal direction */}
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:38s]">
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                {[...Array(4)].map((_, setIndex) =>
                  testimonials.map((testimonial, i) => (
                    <TestimonialCard key={`row1-${setIndex}-${i}`} {...testimonial} />
                  )),
                )}
              </div>
            </div>
            {/* Row 2: reverse direction, identical structure to row 1 */}
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:38s]">
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row group-hover:[animation-play-state:paused]">
                {[...Array(4)].map((_, setIndex) =>
                  testimonials.map((testimonial, i) => (
                    <TestimonialCard key={`row2-${setIndex}-${i}`} {...testimonial} />
                  )),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const demoTestimonials = [
  {
    author: {
      name: 'Emma Thompson',
      handle: '@emmaai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.',
    href: 'https://twitter.com/emmaai',
  },
  {
    author: {
      name: 'David Park',
      handle: '@davidtech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: 'https://twitter.com/davidtech',
  },
  {
    author: {
      name: 'Sofia Rodriguez',
      handle: '@sofiaml',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.',
  },
]

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="Trusted by developers worldwide"
      description="Join thousands of developers who are already building the future with our AI platform"
      testimonials={demoTestimonials}
    />
  )
}
