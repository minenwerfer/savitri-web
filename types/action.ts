export type ActionEvent<T={ _id: string }> = {
  id: number
  name: string
  params?: T|object
}
