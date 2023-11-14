const map = {
  '//localhost:9001/': '//wujie-micro.github.io/demo-react17/'
}

export default function hostMap(host) {
  if (process.env.NODE_ENV === 'production') return map[host]
  return host
}
