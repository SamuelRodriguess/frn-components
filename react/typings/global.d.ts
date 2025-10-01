interface StorefrontFunctionComponent<P = Record<string, unknown>>
  extends FunctionComponent<P> {
  schema?: Record<string, unknown>
  getSchema?(props?: P): Record<string, unknown>
}
