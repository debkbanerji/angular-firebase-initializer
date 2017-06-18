import { {{projectNameCamel}}Page } from './app.po';

describe('{{projectNameKebabCase}} App', () => {
  let page: {{projectNameCamel}}Page;

  beforeEach(() => {
    page = new {{projectNameCamel}}Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
