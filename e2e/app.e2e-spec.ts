import { ReactiveContextPage } from './app.po';

describe('reactive-context App', function() {
  let page: ReactiveContextPage;

  beforeEach(() => {
    page = new ReactiveContextPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
