// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeCommand = (command: any) => {
  cy.task('pluginExecuteCommand', command);
};

export default executeCommand;
