const request = require("supertest");
const app = require("../../index");

describe("Testes da API de objetivos", () => {
  let createdGoalId; // Para armazenar um ID criado

  // Criar um objetivo corretamente
  it("Deve criar um novo objetivo", async () => {
    const res = await request(app).post("/goals").send({
      user_id: 1,
      title: "Ler 10 livros",
      description: "Quero ler 10 livros este ano",
      target_value: 10,
      status: "pendente",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    createdGoalId = res.body.id; // Guardar ID para os próximos testes
  });

  // Criar um objetivo sem 'title' deve retornar erro
  it("Deve retornar erro ao criar objetivo sem 'title'", async () => {
    const res = await request(app).post("/goals").send({
      user_id: 1,
      description: "Falta o título",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe("user_id e title são obrigatórios");
  });

  // Criar um objetivo sem 'user_id' deve retornar erro
  it("Deve retornar erro ao criar objetivo sem 'user_id'", async () => {
    const res = await request(app).post("/goals").send({
      title: "Correr 5 km",
      description: "Quero correr 5 km todas as semanas",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe("user_id e title são obrigatórios");
  });

  // Obter todos os objetivos
  it("Deve obter todos os objetivos", async () => {
    const res = await request(app).get("/goals");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Obter um objetivo por ID
  it("Deve obter um objetivo por ID", async () => {
    const res = await request(app).get(`/goals/${createdGoalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", createdGoalId);
  });

  // Tentar obter um objetivo inexistente
  it("Deve retornar erro ao procurar um objetivo inexistente", async () => {
    const res = await request(app).get("/goals/999999");
    expect(res.statusCode).toBe(404);
  });

  // Atualizar um objetivo corretamente
  it("Deve atualizar um objetivo", async () => {
    const res = await request(app).put(`/goals/${createdGoalId}`).send({
      title: "Ler 20 livros",
      description: "Meta atualizada",
      target_value: 20,
      status: "em progresso",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Ler 20 livros");
  });

  // Tentar atualizar um objetivo inexistente
  it("Deve retornar erro ao atualizar um objetivo inexistente", async () => {
    const res = await request(app).put("/goals/999999").send({
      title: "Meta inexistente",
    });

    expect(res.statusCode).toBe(500);
  });

  // Excluir um objetivo corretamente
  it("Deve excluir um objetivo", async () => {
    const res = await request(app).delete(`/goals/${createdGoalId}`);
    expect(res.statusCode).toBe(200);
  });

  // Tentar excluir um objetivo inexistente
  it("Deve retornar erro ao excluir um objetivo inexistente", async () => {
    const res = await request(app).delete("/goals/999999");
    expect(res.statusCode).toBe(500);
  });

// Buscar objetivos por data
it("Deve buscar objetivos por data", async () => {
    const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const res = await request(app).get(`/goals/by-date?date=${today}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
  
  // Pesquisar objetivos pelo título
  it("Deve pesquisar objetivos pelo título", async () => {
    const res = await request(app).get("/goals/search?query=Ler");
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0); // Deve retornar pelo menos um resultado
  });
  
  // Pesquisar objetivos por intervalo de datas
  it("Deve pesquisar objetivos por intervalo de datas", async () => {
    const startDate = "2024-01-01";
    const endDate = "2024-12-31";
  
    const res = await request(app).get(`/goals/search-by-date-range?startDate=${startDate}&endDate=${endDate}`);
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
  
});
