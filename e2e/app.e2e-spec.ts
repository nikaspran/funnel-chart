import { FunnelChartPage } from './app.po';

describe('funnel-chart App', function() {
  let page: FunnelChartPage;

  beforeEach(() => {
    page = new FunnelChartPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
