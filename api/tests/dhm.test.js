const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const dailyHealthMetricsController = require('../controllers/dailyHealthMetricsController');  // Altere o caminho conforme necessário

const app = express();
app.use(express.json());

// Mock da rota para facilitar os testes
app.post('/dhm', dailyHealthMetricsController.createOrUpdateDailyHealthMetrics);
app.get('/dhm', dailyHealthMetricsController.getAllDailyHealthMetrics);
app.get('/dhm/:id', dailyHealthMetricsController.getDailyHealthMetricsById);
app.put('/dhm/:id', dailyHealthMetricsController.updateDailyHealthMetrics);
app.delete('/dhm/:id', dailyHealthMetricsController.deleteDailyHealthMetrics);
app.get('/dhm/by-date', dailyHealthMetricsController.getDailyHealthMetricsByDate);
app.get('/dhm/search', dailyHealthMetricsController.searchDailyHealthMetrics);
app.get('/dhm/date-range', dailyHealthMetricsController.getDailyHealthMetricsByDateRange);

const prisma = new PrismaClient();

// Limpar a base de dados antes de cada teste
beforeEach(async () => {
  await prisma.daily_health_metrics.deleteMany({});
});

describe('Testes do controlador DailyHealthMetrics', () => {
  let testMetrics = null;

  // Teste para criar ou atualizar métricas de saúde
  it('Deve criar novas métricas de saúde com sucesso', async () => {
    const response = await request(app)
      .post('/dhm')
      .send({
        user_id: 1,
        date: '2025-02-06',
        calories_consumed: 2000,
        water_consumed_ml: 2000,
        steps_count: 10000,
        weight_kg: 70,
        sleep_quality: 80,
        sleep_hours: 8,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    testMetrics = response.body;
  });

  // Teste para atualizar as métricas de saúde
  it('Deve atualizar métricas de saúde com sucesso', async () => {
    const response = await request(app)
      .put(`/dhm/${testMetrics.id}`)
      .send({
        calories_consumed: 2200,
        steps_count: 12000,
      });

    expect(response.status).toBe(200);
    expect(response.body.calories_consumed).toBe(2200);
    expect(response.body.steps_count).toBe(12000);
  });

  // Teste para obter todas as métricas
  it('Deve retornar todas as métricas de saúde', async () => {
    const response = await request(app).get('/dhm');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste para obter métricas por ID
  it('Deve retornar métricas de saúde por ID', async () => {
    const response = await request(app).get(`/dhm/${testMetrics.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testMetrics.id);
  });

  // Teste para falha ao obter métricas com ID inválido
  it('Deve retornar erro para ID inválido ao buscar métricas de saúde', async () => {
    const response = await request(app).get('/dhm/99999');
    expect(response.status).toBe(404);
    expect(response.body.erro).toBe('Registro com ID 99999 não encontrado');
  });

  // Teste para remover métricas de saúde
  it('Deve remover métricas de saúde com sucesso', async () => {
    const response = await request(app).delete(`/dhm/${testMetrics.id}`);
    expect(response.status).toBe(200);
    expect(response.body.mensagem).toContain(`daily_health_metrics com ID ${testMetrics.id} foi removido com sucesso.`);
  });

  // Teste para falha ao remover métricas com ID inválido
  it('Deve retornar erro ao tentar remover métricas com ID inválido', async () => {
    const response = await request(app).delete('/dhm/99999');
    expect(response.status).toBe(404);
    expect(response.body.erro).toContain('Não foi possível apagar o registro');
  });

  // Teste para obter métricas por data
  it('Deve retornar métricas de saúde por data', async () => {
    const response = await request(app).get('/dhm/by-date?user_id=1&date=2025-02-06');
    expect(response.status).toBe(200);
    expect(response.body.user_id).toBe(1);
    expect(response.body.date).toBe('2025-02-06T00:00:00.000Z');
  });

  // Teste para buscar métricas com parâmetros de pesquisa
  it('Deve retornar métricas de saúde com base na pesquisa', async () => {
    const response = await request(app)
      .get('/dhm/search')
      .query({ user_id: 1, calories_consumed: 2200 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  // Teste para buscar métricas num intervalo de datas
  it('Deve retornar métricas de saúde dentro de um intervalo de datas', async () => {
    const response = await request(app)
      .get('/dhm/date-range')
      .query({ user_id: 1, startDate: '2025-02-01', endDate: '2025-02-28' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
