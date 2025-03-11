namespace UKParliament.CodeTest.Web.ViewModels;

//todo: this breaks SRP - class is responsible to presenting links, and for adding links.  better to break into Two

public class HyperMediaViewModel
{
    public List<LinkResource> Links = new();

    public void AddLink(LinkResource resource)
    {
        Links.Add(resource);
    }

    public void AddLink(string href, string rel, string Method)
    {
        var resource = new LinkResource(href, rel, Method);
        AddLink(resource);
    }

    public void AddGetLink(string href, string rel)
    {
        AddLink(href, rel, "GET");
    }

    public void AddSelfLink(string href)
    {
        AddGetLink(href, "self");
    }
}
