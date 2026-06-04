using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace central_de_manutencao.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByToStockMovement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "StockMovements",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StockMovements");
        }
    }
}
