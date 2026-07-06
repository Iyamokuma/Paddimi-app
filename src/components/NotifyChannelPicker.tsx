import { Mail, MessageSquare } from 'lucide-react'
import { Card } from './ui/Card'
import type { NotifyChannel } from '../lib/customer'

interface NotifyChannelPickerProps {
  value: NotifyChannel
  onChange: (channel: NotifyChannel) => void
}

export function NotifyChannelPicker({ value, onChange }: NotifyChannelPickerProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">Where should we send your code?</h3>
      <p className="mt-1 text-xs text-muted">
        Your 4-character download code is sent immediately after payment is confirmed.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {([
          { channel: 'sms' as const, label: 'SMS', desc: 'Text message to your phone', icon: MessageSquare },
          { channel: 'email' as const, label: 'Email', desc: 'Email to your inbox', icon: Mail },
        ]).map((opt) => (
          <Card
            key={opt.channel}
            hover
            selected={value === opt.channel}
            onClick={() => onChange(opt.channel)}
            className="!p-4"
          >
            <opt.icon className="h-5 w-5 text-brand-500" />
            <p className="mt-2 text-sm font-medium">{opt.label}</p>
            <p className="mt-0.5 text-xs text-muted">{opt.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
