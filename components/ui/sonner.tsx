import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <div className="bg-emerald-500/20 p-1 rounded-lg text-emerald-500">
            <CircleCheckIcon className="size-4" />
          </div>
        ),
        info: (
          <div className="bg-blue-500/20 p-1 rounded-lg text-blue-500">
            <InfoIcon className="size-4" />
          </div>
        ),
        warning: (
          <div className="bg-amber-500/20 p-1 rounded-lg text-amber-500">
            <TriangleAlertIcon className="size-4" />
          </div>
        ),
        error: (
          <div className="bg-red-500/20 p-1 rounded-lg text-red-500">
            <OctagonXIcon className="size-4" />
          </div>
        ),
        loading: (
          <div className="bg-slate-500/20 p-1 rounded-lg text-slate-500">
            <Loader2Icon className="size-4 animate-spin" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-slate-900 group-[.toaster]:border-white/20 group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
          description: "group-[.toast]:text-slate-500 group-[.toast]:text-xs group-[.toast]:font-medium",
          actionButton: "group-[.toast]:bg-[#004d35] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:font-bold group-[.toast]:px-4 group-[.toast]:h-8",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:font-bold group-[.toast]:px-4 group-[.toast]:h-8",
          title: "group-[.toast]:font-bold group-[.toast]:text-sm group-[.toast]:tracking-tight",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
