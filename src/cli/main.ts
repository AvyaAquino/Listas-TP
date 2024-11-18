import readline from "readline";
import { Agenda } from "../models/Agenda";
import { Cliente } from "../models/Cliente";
import { ProdutoOuServico } from "../models/ProdutoOuServico";
import { parse } from "path";

const agenda = new Agenda();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const menu = `
Escolha uma opção:
1 - Adicionar cliente
2 - Listar clientes
3 - Atualizar cliente
4 - Remover cliente
5 - Adicionar produto ou serviço
6 - Listar produtos ou serviços
7 - Atualizar produto ou serviço
8 - Remover produto ou serviço
9 - Registrar consumo
10 - Mostrar relatórios
11 - Salvar dados
12 - Carregar dados
13 - Cadastrar dados genericos de teste
sair - Sair
`;

function mostrarMenu() {
    rl.question(menu, (resposta: any) => {
        switch (resposta) {
            case '1':
                adicionarCliente();
                break;
            case '2':
                listarClientes();
                break;
            case '3':
                atualizarCliente();
                break;
            case '4':
                removerCliente();
                break;
            case '5':
                adicionarProdutoOuServico(); 
                break;
            case '6':
                listarProdutoOuServico();
                break;
            case '7':
                atualizarProdutoOuServico();
                break;
            case '8':
                removerProdutoOuServico();
                break;
            case '9':
                registrarConsumo();
                break;
            case '10':
                mostrarRelatorios();
                break;
            case '11':
                agenda.salvarDados('clientes.json', 'produtos.json');
                mostrarMenu();
                break;
            case '12':
                agenda.carregarDados('clientes.json', 'produtos.json');
                mostrarMenu();
                break;
            case '13':
                cadastrarDadosTeste();
                break;
            case 'sair':
                console.log('Até mais!');
                rl.close();
                break;
            default:
                console.log('Opção inválida');
                mostrarMenu();
        }
    });
}

function adicionarCliente() {
    rl.question('Nome: ', (nome: any) => {
        rl.question('Gênero (M/F/Outro): ', (genero: any) => {
            rl.question('Email: ', (email: any) => {
                rl.question('Telefone: ', (telefone: any) => {
                    const id = agenda.listarClientes().length + 1;
                    const novoCliente = new Cliente(id, nome, genero as 'M' | 'F' | 'Outro', email, telefone);
                    agenda.adicionarCliente(novoCliente);
                    console.log('Cliente adicionado com sucesso');
                    mostrarMenu();
                }
                );
            }
            );
        }
        );
    }
    );
}

function listarClientes() {
    console.log('Clientes cadastrados:');
    const clientesFormatados = agenda.listarClientes().map(cliente => ({
        id: cliente.id,
        nome: cliente.nome,
        genero: cliente.genero,
        telefone: cliente.telefone,
        email: cliente.email,
        consumo: cliente.consumo.map(c => ({
            produtoId: c.produtoId,
            quantidade: c.quantidade,
            valor: c.valor
        }))
    }));
    console.log(JSON.stringify(clientesFormatados, null, 2));
    mostrarMenu();
}

function removerCliente() {
    rl.question('ID do cliente: ', (id: any) => {
        agenda.removerCliente(parseInt(id));
        console.log('Cliente removido com sucesso');
        mostrarMenu();
    });
}

function adicionarProdutoOuServico() {
    rl.question('Nome: ', (nome: any) => {
        rl.question('Tipo (produto/serviço): ', (tipo: any) => {
            rl.question('Preço: ', (preco: any) => {
                const id = agenda.listarProdutoOuServico().length + 1;
                const novoProdutoOuServico = new ProdutoOuServico(id, nome, tipo as 'produto' | 'serviço', parseFloat(preco));
                agenda.adicionarProdutoOuServico(novoProdutoOuServico);
                console.log('Produto ou serviço adicionado com sucesso');
                mostrarMenu();
            }
            );
        }
        );
    }
    );
}

function listarProdutoOuServico() {
    console.log('Produtos ou serviços cadastrados:', agenda.listarProdutoOuServico());
    mostrarMenu();
}

function removerProdutoOuServico() {
    rl.question('ID do produto ou serviço: ', (id: any) => {
        agenda.removerProdutoOuServico(parseInt(id));
        console.log('Produto ou serviço removido com sucesso');
        mostrarMenu();
    });
}

function registrarConsumo() {
    rl.question('ID do cliente: ', (clienteId: any) => {
        rl.question('ID do produto ou serviço: ', (produtoId: any) => {
            rl.question('Quantidade: ', (quantidade: any) => {
                try {
                    agenda.registrarConsumo(
                        parseInt(clienteId),
                        parseInt(produtoId),
                        parseInt(quantidade)
                    )
                    console.log('Consumo registrado com sucesso');
                } catch (error: any) {
                    console.log('Erro ao registrar consumo:', error.message);
                }
                mostrarMenu();
            }
            );
        }
        );
    }
    );
}

function atualizarCliente() {
    rl.question('ID do cliente: ', (id: any) => {
        const clienteId = parseInt(id);
        rl.question('Nome: (deixe vazio para manter) ', (nome: any) => {
            rl.question('Gênero (M/F/Outro): (deixe vazio para manter) ', (genero: any) => {
                rl.question('Email: (deixe vazio para manter) ', (email: any) => {
                    rl.question('Telefone: (deixe vazio para manter) ', (telefone: any) => {
                        try {
                            agenda.atualizarCliente(clienteId, {
                                nome: nome || undefined,
                                genero: genero as 'M' | 'F' | 'Outro' || undefined,
                                email: email || undefined,
                                telefone: telefone || undefined
                            });
                            console.log('Cliente atualizado com sucesso');
                        } catch (error: any) {
                            console.log('Erro ao atualizar cliente:', error.message);
                        }
                        mostrarMenu();
                    }
                    );
                }
                );
            }
            );
        }
        );
    }
    );
}

function atualizarProdutoOuServico() {
    rl.question('ID do produto ou serviço: ', (id: any) => {
        const produtoId = parseInt(id);
        rl.question('Nome: (deixe vazio para manter) ', (nome: any) => {
            rl.question('Tipo (produto/serviço): (deixe vazio para manter) ', (tipo: any) => {
                rl.question('Preço: (deixe vazio para manter) ', (preco: any) => {
                    try {
                        agenda.atualizarProdutoOuServico(produtoId, {
                            nome: nome || undefined,
                            tipo: tipo as 'produto' | 'serviço' || undefined,
                            preco: preco ? parseFloat(preco) : undefined
                        });
                        console.log('Produto ou serviço atualizado com sucesso');
                    } catch (error: any) {
                        console.log('Erro ao atualizar produto ou serviço:', error.message);
                    }
                    mostrarMenu();
                }
                );
            }
            );
        }
        );
    }
    );
}

function mostrarRelatorios() {
    console.log(`
        Escolha um relatório:
        1 - Top 10 clientes por quantidade
        2 - Clientes por gênero
        3 - Produtos mais consumidos
        4 - Produtos mais consumidos por genêro
        5 - Top 10 clientes por menor consumo
        6 - Top 5 clientes por valor
        0 - Voltar`
    )

    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1': {
                const top10Quantidade = agenda.listarTop10ClientesPorQuantidade();
                console.log('Top 10 clientes por quantidade:');
                console.log(JSON.stringify(top10Quantidade, null, 2));
                break;
            }
            case '2': {
                const clientesPorGenero = agenda.listarClientesPorGenero();
                console.log('Clientes por gênero:');
                console.log(JSON.stringify(clientesPorGenero, null, 2));
                break;
            }
            case '3': {
                const produtosMaisConsumidos = agenda.listarProdutosMaisConsumidos();
                console.log('Produtos mais consumidos:');
                console.log(JSON.stringify(produtosMaisConsumidos, null, 2));
                break;
            }
            case '4': {
                const produtosPorGenero = agenda.listarProdutosMaisConsumidosPorGenero();
                console.log('Produtos mais consumidos por gênero:');
                console.log(JSON.stringify(produtosPorGenero, null, 2));
                break;
            }
            case '5': {
                const top10MenorConsumo = agenda.listarTop10ClientesPorMenosConsumo();
                console.log('Top 10 clientes por menor consumo:');
                console.log(JSON.stringify(top10MenorConsumo, null, 2));
                break;
            }
            case '6': {
                const top5Valor = agenda.listarTop5ClientesPorValor();
                console.log('Top 5 clientes por valor:');
                console.log(JSON.stringify(top5Valor, null, 2));
                break;
            }
            case '0':
                mostrarMenu();
                return;
            default:
                console.log('Opção inválida!');
        }
        mostrarRelatorios();
    });

}

function cadastrarDadosTeste() {
    for (let i = 1; i <= 30; i++) {
        const cliente = new Cliente(
            i,
            `Cliente ${i}`,
            i % 3 === 0 ? 'Outro' : i % 2 === 0 ? 'F' : 'M',
            `cliente${i}@example.com`,
            `12345678${i}`
        );
        agenda.adicionarCliente(cliente);
    }

    for (let i = 1; i <= 20; i++) {
        const produtoOuServico = new ProdutoOuServico(
            i,
            `Produto/Serviço ${i}`,
            i % 2 === 0 ? 'produto' : 'serviço',
            parseFloat((10 + i * 2).toFixed(2)) 
        );
        agenda.adicionarProdutoOuServico(produtoOuServico);
    }

    agenda.listarClientes().forEach(cliente => {
        const numProdutosConsumidos = Math.floor(Math.random() * 5) + 1; // Cada cliente consome de 1 a 5 produtos/serviços
        for (let j = 0; j < numProdutosConsumidos; j++) {
            const produtoId = Math.floor(Math.random() * 20) + 1; // Seleciona um produto/serviço aleatório (1 a 20)
            const quantidade = Math.floor(Math.random() * 3) + 1; // Consome entre 1 e 3 unidades
            try {
                agenda.registrarConsumo(cliente.id, produtoId, quantidade);
            } catch (error: any) {
                console.error(`Erro ao registrar consumo para Cliente ${cliente.id}:`, error.message);
            }
        }
    });

    console.log('30 clientes e 20 produtos/serviços cadastrados com sucesso!');
    console.log('Consumo registrado para cada cliente');
    mostrarMenu();
}


mostrarMenu();