using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Tests.Unit;

public class HyperMediaViewModelTests
{
    [Fact]
    public void CanAdd_Selflink()
    {
        var href = "http://api.com/v1/thing/1";

        var item = new HyperMediaViewModel();
        item.AddSelfLink(href);
        Assert.Single(item.Links);

        var link = item.Links.First();
        Assert.Equal("self", link.Rel);
        Assert.Equal("GET", link.Method);
        Assert.Equal(href, link.Href);
    }
}
