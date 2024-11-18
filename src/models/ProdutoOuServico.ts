export class ProdutoOuServico {
    constructor(
      public id: number,
      public nome: string,
      public tipo: 'produto' | 'serviço',
      public preco: number
    ) {}
  }