export class Cliente {
    constructor(
      public id: number,
      public nome: string,
      public genero: 'M' | 'F' | 'Outro',
      public email: string,
      public telefone: string,
      public consumo: { produtoId: number; quantidade: number; valor: number }[] = []
    ) {}
  }