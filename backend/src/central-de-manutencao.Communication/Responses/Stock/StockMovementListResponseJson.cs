namespace central_de_manutencao.Communication.Responses.Stock;

public class StockMovementListResponseJson
{
    public List<StockMovementResponseJson> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}
