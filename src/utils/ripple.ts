export const ripple = (event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  if (!container) return

  const circle = document.createElement('span')
  const diameter = Math.max(container.clientWidth, container.clientHeight)
  const radius = diameter / 2

  const rect = container.getBoundingClientRect()
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - rect.left - radius}px`
  circle.style.top = `${event.clientY - rect.top - radius}px`
  circle.classList.add('ripple')

  const ripple = container.getElementsByClassName('ripple')[0]
  if (ripple) {
    ripple.remove()
  }

  container.appendChild(circle)

  setTimeout(() => {
    circle.remove()
  }, 600)
}
