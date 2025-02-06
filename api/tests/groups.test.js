const request = require("supertest");
const app = require("../../index");

describe("Testes da API de grupos", () => {
  let groupId; // Para armazenar o ID d º+pe um grupo de teste

  // Criar um grupo antes dos testes
  beforeAll(async () => {
    const res = await request(app).post("/groups").send({
      name: "Grupo de Teste",
      description: "Descrição do grupo",
      image_path: "/imagens/grupo.jpg",
      created_by: 1, // Assume-se que o utilizador com ID 1 existe
    });

    groupId = res.body.id; // Armazena o ID do grupo criado
  });

  // Eliminar o grupo depois dos testes
  afterAll(async () => {
    await request(app).delete(`/groups/${groupId}`);
  });

  it("Deve criar um novo grupo", async () => {
    const res = await request(app).post("/groups").send({
      name: "Grupo Novo",
      description: "Grupo criado para testes",
      image_path: "/imagens/novo.jpg",
      created_by: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("Deve retornar erro ao criar um grupo sem 'name'", async () => {
    const res = await request(app).post("/groups").send({
      description: "Sem nome",
      created_by: 1,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe("Parâmetros obrigatórios ausentes");
  });

  it("Deve obter todos os grupos", async () => {
    const res = await request(app).get("/groups");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("Deve obter um grupo por ID", async () => {
    const res = await request(app).get(`/groups/${groupId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", groupId);
  });

  it("Deve retornar erro ao procurar um grupo inexistente", async () => {
    const res = await request(app).get("/groups/99999");
    expect(res.statusCode).toBe(404);
  });

  it("Deve atualizar um grupo", async () => {
    const res = await request(app).put(`/groups/${groupId}`).send({
      name: "Grupo Atualizado",
      description: "Descrição modificada",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Grupo Atualizado");
  });

  it("Deve retornar erro ao atualizar um grupo inexistente", async () => {
    const res = await request(app).put("/groups/99999").send({
      name: "Grupo Inexistente",
    });

    expect(res.statusCode).toBe(500);
  });

  it("Deve pesquisar grupos pelo nome", async () => {
    const res = await request(app).get("/groups/search?query=Grupo");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("Deve buscar grupos por data", async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await request(app).get(`/groups/date?date=${today}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("Deve pesquisar grupos por intervalo de datas", async () => {
    const res = await request(app).get(
      "/groups/date-range?startDate=2024-01-01&endDate=2024-12-31"
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("Deve excluir um grupo", async () => {
    const res = await request(app).delete(`/groups/${groupId}`);
    expect(res.statusCode).toBe(200);
  });

  it("Deve retornar erro ao excluir um grupo inexistente", async () => {
    const res = await request(app).delete("/groups/99999");
    expect(res.statusCode).toBe(500);
  });
});
