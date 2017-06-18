import { AngularFirebaseInitializerPage } from './app.po';

describe('angular-firebase-initializer App', () => {
  let page: AngularFirebaseInitializerPage;

  beforeEach(() => {
    page = new AngularFirebaseInitializerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
