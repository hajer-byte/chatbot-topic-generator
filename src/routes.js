import GenerateTopicIdeas from "./components/views/Detail/Topics/GenerateTopicIdeas";

const personaRoutes = [
  {
    path: "/topic-finder",
    name: "GenerateIdea",
    component: GenerateTopicIdeas,
    exact: true,
  },
];

export default {
  PROTECTED: personaRoutes,
  PUBLIC: [],
};
