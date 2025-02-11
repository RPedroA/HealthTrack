# HealthTrack - Gestão de Saúde

HealthTrack é uma aplicação web desenvolvida para ajudar os utilizadores a monitorizar e gerir as suas métricas diárias de saúde, atividades físicas e objetivos. A plataforma oferece também funcionalidades sociais, permitindo que os utilizadores participem em grupos de discussão sobre tópicos relacionados à saúde, como alimentação, treino, meditação, entre outros. Além disso, os utilizadores podem criar posts dentro desses grupos, interagir com outros membros e acompanhar a evolução da sua saúde ao longo do tempo.

A aplicação oferece uma interface moderna e intuitiva, sendo responsiva para uma navegação fácil e fluída. O objetivo é proporcionar uma ferramenta prática para melhorar o acompanhamento da saúde e promover a interação entre utilizadores com interesses semelhantes.

## Funcionalidades

- **Gestão de Métricas de Saúde**: Permite que os utilizadores registrem e acompanhem as suas métricas diárias, como peso, altura, pressão arterial e outros dados de saúde.
  
- **Gestão de Atividades Físicas**: Os utilizadores podem registar as suas atividades físicas diárias, acompanhar o desempenho e definir metas para melhorar a sua condição física.

- **Objetivos de Saúde**: Permite que os utilizadores definam e monitorem objetivos pessoais relacionados à saúde, como perder peso, aumentar a resistência, melhorar o sono, etc.

- **Grupos de Discussão**: A aplicação oferece a possibilidade de os utilizadores participarem em grupos temáticos sobre tópicos de saúde e bem-estar.

- **Posts em Grupos**: Os utilizadores podem criar, visualizar e interagir com posts dentro dos grupos, partilhando conhecimentos, experiências e interagindo com outros membros da comunidade.

## Tecnologias Utilizadas

- **Frontend**: A interface do utilizador foi desenvolvida utilizando **React**, com **Bootstrap** para design responsivo e **Vite** como ferramenta de build e desenvolvimento, proporcionando uma experiência rápida e otimizada.

- **Backend**: A lógica de servidor foi implementada com **JavaScript** e **Node.js**, utilizando **Prisma** para a gestão da base de dados, que é construída em **PostgreSQL**.

- **Autenticação**: A gestão de autenticação e sessões é feita através de **JWT (JSON Web Tokens)**, garantindo que a comunicação entre o frontend e o backend seja segura.

- **Segurança de Senhas**: As senhas dos utilizadores são encriptadas utilizando **bcrypt**, garantindo a segurança dos dados sensíveis.
