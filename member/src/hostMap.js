const map = {
  '//localhost:7100/': '//wujie-micro.github.io/demo-react17/'
}

export default function hostMap(host) {
  if (process.env.NODE_ENV === 'production') return map[host]
  return host
}
