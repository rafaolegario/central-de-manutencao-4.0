namespace central_de_manutencao.Communication.Responses.Onboarding
{
    public class OnboardingStatusResponseJson
    {
        public bool HasTools { get; set; }
        public bool HasStockItems { get; set; }
        public bool HasTechnicians { get; set; }
        public bool Complete { get; set; }
    }
}
