import GenerateTopic from "./components/views/Detail/Topics/GenerateTopic";

const personaRoutes = [
  {
    path: "/topic-finder",
    name: "GenerateIdea",
    component: GenerateTopic,
    exact: true,
  },
];

export default {
  PROTECTED: personaRoutes,
  PUBLIC: [],
};
