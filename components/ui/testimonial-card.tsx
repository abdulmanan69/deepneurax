import React from 'react'
import Image from 'next/image'

export interface TestimonialAuthor {
  name: string
  handle?: string
  avatar?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

const cn = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(' ')

export function TestimonialCard({ author, text, href, className }: TestimonialCardProps) {
  const Card: any = href ? 'a' : 'div'

  return (
    <Card
      {...(href ? { href, target: '_blank', rel: 'noreferrer' } : {})}
      className={cn(
        'flex flex-col rounded-lg border-t',
        'bg-gradient-to-b from-gray-50 to-white',
        'p-4 text-start sm:p-6',
        'hover:from-gray-100 hover:to-white',
        'max-w-[320px] sm:max-w-[320px]',
        'transition-colors duration-300',
        'shadow-[0_10px_40px_-30px_rgba(15,23,42,0.45)]',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200" />
        )}
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-gray-900">{author.name}</h3>
          {author.handle && <p className="text-sm text-gray-500">{author.handle}</p>}
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-gray-600">{text}</p>
    </Card>
  )
}
