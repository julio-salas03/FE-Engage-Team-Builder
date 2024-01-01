const componentsPath = "./../../../components";
const templatesPath = "./../templates";

export default function generator(plop) {
  plop.setGenerator("component", {
    description: "Create an atomic component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name please",
      },
      {
        type: "list",
        name: "type",
        message: "What type of component is this?",
        choices: ["atoms", "molecules", "organisms"],
      },
    ],
    actions: [
      {
        type: "add",
        path: `${componentsPath}/{{type}}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
        templateFile: `${templatesPath}/component.hbs`,
      },
      {
        type: "add",
        path: `${componentsPath}/{{type}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx`,
        templateFile: `${templatesPath}/story.hbs`,
      },
      {
        type: "add",
        path: `${componentsPath}/{{type}}/{{pascalCase name}}/index.ts`,
        templateFile: `${templatesPath}/index.hbs`,
      },
    ],
  });
}
