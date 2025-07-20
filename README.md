# Structura – Project & Task Management with Google Maps Integration

**Structura** is a responsive web application designed to manage projects and tasks through a geographic interface using Google Maps. It allows contractors and administrators to create projects, assign tasks, draw actions directly on the map, and manage teams visually and efficiently.

---

## 🚀 Features

- Project creation with metadata (type, deadline, status).
- Task management per project (name, description, responsible, status, deadline).
- Actions linked to tasks through Google Maps:
  - Add markers with color and description.
  - Draw and save polylines.
- Assign multiple teams to each task.
- Responsive and clean UI for desktop and mobile.
- Role-based structure ready for future extension.

---

## 🧰 Tech Stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** TailwindCSS + Material UI
- **State Management:** Zustand (modular slices)
- **Routing:** React Router DOM
- **Maps:** @react-google-maps/api (Google Maps JS API)

---

## 📁 Project Structure

```
src/
│
├── app/
│   ├── App.tsx
│   └── AppRouter.tsx
│
├── assets/
│
├── components/
│   ├── dashboard/
│   │   └── DashboardContainer.tsx
│   ├── header/
│   │   └── HeaderContainer.tsx
│   ├── layout/
│   │   └── LayoutContainer.tsx
│   ├── proyectos/
│   │   ├── components/
│   │   │   ├── NewProjectForm.tsx
│   │   │   ├── ProyectosTable.tsx
│   │   │   ├── ProyectosTableSkeleton.tsx
│   │   │   └── SelectedProjectCard.tsx
│   │   ├── data/
│   │   │   └── dataProjects.json
│   │   └── ProyectosContainer.tsx
│   ├── sidebar/
│   │   └── SidebarContainer.tsx
│   ├── supervisores/
│   │   └── SupervisoresContainer.tsx
│   └── tareas/
│       ├── components/
│       │   ├── AssignTeamsModal.tsx
│       │   ├── NewTaskModal.tsx
│       │   └── TaskDetailContainer.tsx
│       ├── data/
│       │   └── dataTasksTeams.json
│       └── TareasContainer.tsx
│
├── features/
│
├── globalState/
│   ├── projectsStore.ts
│   └── tasksStore.ts
│
├── shared/
│   ├── interfaces/
│   │   ├── project.ts
│   │   └── task.ts
│   └── services/
│       ├── projectsService.ts
│       └── taskTeamService.ts
│
├── styles/
│   ├── index.css
│   └── main.tsx
│
└── vite-env.d.ts
```

---

## 🧪 How to Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-user/taskmap.git
cd taskmap
```

2. **Install dependencies**
```bash
npm install
```

3. **Add your environment variables**
Create a `.env` file and set your Google Maps API key:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## 📱 Responsive Design

Every component is fully responsive and optimized for mobile and desktop use.

---

## 🌍 Language and Naming Convention

- All visible UI content is in **English**.
- All **new** logic and files are named in **English** from now on, following our agreed convention.

---

## 📌 Notes

- Backend integration (via API) is planned for actions and task persistence.
- The app is structured using **modular architecture**, with clean separation of concerns and scoped state management.

---