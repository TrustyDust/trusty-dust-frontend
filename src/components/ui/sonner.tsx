import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      closeButton
      richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#040b1e]/95 text-white border border-white/10 backdrop-blur-xl shadow-[0_20px_45px_rgba(2,10,25,0.65)]",
          title: "text-sm font-semibold tracking-wide text-white",
          description: "text-xs text-gray-300/90",
          actionButton:
            "group-[.toast]:bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] group-[.toast]:text-white group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-gray-300 group-[.toast]:border group-[.toast]:border-white/20 group-[.toast]:hover:bg-white/5",
          loader: "text-[#7BDFFF]",
          closeButton: "text-gray-400 hover:text-white",
        },
        style: {
          borderRadius: 16,
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
