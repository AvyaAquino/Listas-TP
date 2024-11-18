import { Cliente } from './Cliente';
import { ProdutoOuServico } from './ProdutoOuServico';
import fs from 'fs';
import path from 'path';

export class Agenda {
    private clientes: Cliente[] = [];
    private ProdutoOuServico: ProdutoOuServico[] = [];
    
    listarTop10ClientesPorQuantidade(): Cliente[] {
        return this.clientes
        .map(cliente => ({
            ...cliente,
            total: cliente.consumo.reduce((acc, consumo) => acc + consumo.quantidade, 0)
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    }

    listarClientesPorGenero(): { genero: string; clientes: Cliente[] }[] {
        const grupos = this.clientes.reduce((acc, cliente) => {
            if (!acc[cliente.genero]) acc[cliente.genero] = [];
            acc[cliente.genero].push(cliente);
            return acc;
        }, {} as { [genero: string]: Cliente[] });

        return Object.entries(grupos).map(([genero, clientes]) => ({ genero, clientes }));
    }

    listarProdutosMaisConsumidos(): { produto: ProdutoOuServico; total: number }[] {
        const consumoTotal = this.clientes.flatMap(cliente => cliente.consumo)
        const totalPorProduto = consumoTotal.reduce((acc, item) => {
            acc[item.produtoId] = (acc[item.produtoId] || 0) + item.quantidade;
            return acc;
        }, {} as { [produtoId: number]: number });

        return this.ProdutoOuServico
        .map(produto => ({
            produto,
            total: totalPorProduto[produto.id] || 0
        }))
        .sort((a, b) => b.total - a.total);

    }

    listarProdutosMaisConsumidosPorGenero(): Record<string, { produto: ProdutoOuServico; total: number }[]> {
        const consumoPorGenero = this.clientes.reduce((acc, cliente) => {
            if (!acc[cliente.genero]) acc[cliente.genero] = [];
            acc[cliente.genero].push(...cliente.consumo);
            return acc;
        }, {} as Record<string, { produtoId: number; quantidade: number }[]>);

        const resultados: Record<string, { produto: ProdutoOuServico; total: number }[]> = {};

        for (const [genero, consumos] of Object.entries(consumoPorGenero)) {
            const totalPorProduto = consumos.reduce((acc, item) => {
                acc[item.produtoId] = (acc[item.produtoId] || 0) + item.quantidade;
                return acc;
            }, {} as Record<number, number>);

            resultados[genero] = this.ProdutoOuServico
            .map(produto => ({
                produto,
                total: totalPorProduto[produto.id] || 0
            }))
            .sort((a, b) => b.total - a.total);
        }

        return resultados;

    }

    listarTop10ClientesPorMenosConsumo(): Cliente[] {
        return this.clientes
        .map(cliente => ({
            ...cliente,
            total: cliente.consumo.reduce((acc, consumo) => acc + consumo.quantidade, 0)
        }))
        .sort((a, b) => a.total - b.total)
        .slice(0, 10);
    }

    listarTop5ClientesPorValor(): Cliente[] {
        return this.clientes
        .map(cliente => ({
            ...cliente,
            total: cliente.consumo.reduce((acc, consumo) => acc + consumo.valor, 0)
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
    }

    adicionarCliente(clientes: Cliente): void {
        this.clientes.push(clientes);
    }

    listarClientes(): Cliente[] {
        return this.clientes;
    }

    removerCliente(id: number): void {
        this.clientes = this.clientes.filter(cliente => cliente.id !== id);
    }

    adicionarProdutoOuServico(produtoOuServico: ProdutoOuServico): void {
        this.ProdutoOuServico.push(produtoOuServico);
    }

    listarProdutoOuServico(): ProdutoOuServico[] {
        return this.ProdutoOuServico;
    }

    removerProdutoOuServico(id: number): void {
        this.ProdutoOuServico = this.ProdutoOuServico.filter(produtoOuServico => produtoOuServico.id !== id);
    }

    registrarConsumo(clienteId: number, produtoId: number, quantidade: number): void {
        const cliente = this.clientes.find(cliente => cliente.id === clienteId);
        const produto = this.ProdutoOuServico.find(produto => produto.id === produtoId);

        if (!cliente || !produto) {
            throw new Error('Cliente ou produto não encontrado');
        }

        cliente.consumo.push({
            produtoId,
            quantidade,
            valor: produto.preco * quantidade
        });
    }

    salvarDados(clientesFile: string, produtosFile: string): void {

        const dataDir = path.resolve(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        const clientesPath = path.resolve(dataDir, clientesFile);
        const produtosPath = path.resolve(dataDir, produtosFile);

        fs.writeFileSync(clientesPath, JSON.stringify(this.clientes, null, 2));
        fs.writeFileSync(produtosPath, JSON.stringify(this.ProdutoOuServico, null, 2));

        console.log('Dados salvos com sucesso');
    }

    carregarDados(clientesFile: string, produtosFile: string): void {
        const dataDir = path.resolve(__dirname, '..', 'data');
        const clientesPath = path.resolve(dataDir, clientesFile);
        const produtosPath = path.resolve(dataDir, produtosFile);

        if (fs.existsSync(clientesPath)) {
            const clientesData = fs.readFileSync(clientesPath, 'utf-8');
            this.clientes = JSON.parse(clientesData) as Cliente[];
        } else {
            console.log('Arquivo de clientes não encontrado');
        }

        if (fs.existsSync(produtosPath)) {
            const produtosData = fs.readFileSync(produtosPath, 'utf-8');
            this.ProdutoOuServico = JSON.parse(produtosData) as ProdutoOuServico[];
        } else {
            console.log('Arquivo de produtos ou serviços não encontrado');
        }

        console.log('Dados carregados com sucesso');
    }

    atualizarCliente(id: number, novosDados: Partial<Omit<Cliente, 'id'>>): void {
        const cliente = this.clientes.find(cliente => cliente.id === id);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        Object.assign(cliente, novosDados);
        console.log('Cliente atualizado com sucesso');
}
    atualizarProdutoOuServico(id: number, novosDados: Partial<Omit<ProdutoOuServico, 'id'>>): void {
        const produtoOuServico = this.ProdutoOuServico.find(produtoOuServico => produtoOuServico.id === id);
        if (!produtoOuServico) {
            throw new Error('Produto ou serviço não encontrado');
        }
        Object.assign(produtoOuServico, novosDados);
        console.log('Produto ou serviço atualizado com sucesso');
    }
}
