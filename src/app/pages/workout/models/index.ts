export interface ArticleResponse {
  sEcho: number;
  iTotalRecords: number;
  iTotalDisplayRecords: number;
  aaData: Article[];
}

export interface Article {
  idarticulo: string;
  idcategoria: string;
  categoria: string;
  codigo: string;
  nombre: string;
  stock: string;
  descripcion: string;
  imagen: string;
  condicion: string;
}
