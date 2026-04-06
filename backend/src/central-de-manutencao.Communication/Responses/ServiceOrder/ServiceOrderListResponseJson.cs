namespace central_de_manutencao.Communication.Responses.ServiceOrder
{
    public class ServiceOrderListResponseJson
    {
        public List<ServiceOrderResponseJson> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
}
