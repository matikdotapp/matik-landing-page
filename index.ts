type Location = {
  name: string
  dir: string
  ext: string
}

interface Paths extends Location {
  path: string
}

const location = function(params: Location) {
  const { dir, name, ext } = params
  return [dir, name].join('/').concat(`.${ext}`)
}

const removeKey = function(obj: Paths) {
  const {path, ...rest} = obj
  return rest
}

const getHeaderType = function(ext: string) {
  if (ext === "js")   return "application/javascript"
  if (ext === "css")  return "text/css"
  return "text/html"
}

const paths = [
  {
    path: "/",
    name: 'index',
    dir: 'src',
    ext: 'html'
  },
  {
    path: "/dist/style.css",
    name: 'style',
    dir: 'dist',
    ext: 'css'
  },
]

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url)

    for (let p = 0; p < paths.length; p++) {
      let arrPath = paths[p]
      
      console.log(url.pathname, arrPath.path)

      if (url.pathname === arrPath.path) {
        let obj = removeKey(arrPath)
        let dir = location(obj)
        let type = getHeaderType(arrPath.ext) 
        return new Response(Bun.file(dir), {headers: { "Content-Type": type }})
      }
    }

    // Default 404 response for unknown routes
    return new Response("Page Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);