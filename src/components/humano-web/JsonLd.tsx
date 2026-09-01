// Los datos estructurados se inyectan como <script type="application/ld+json">.
// Es un server component: el JSON tiene que estar en el HTML servido, porque los
// rastreadores de Google y de los LLM no ejecutan JavaScript.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
