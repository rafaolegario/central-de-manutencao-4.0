using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace central_de_manutencao.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedToToolAndStockItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Tools",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "StockItems",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Tools");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "StockItems");
        }
    }
}
