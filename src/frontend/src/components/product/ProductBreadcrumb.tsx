import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";

interface ProductBreadcrumbProps {
  category: string;
  productTitle: string;
}

export function ProductBreadcrumb({
  category,
  productTitle,
}: ProductBreadcrumbProps) {
  const truncatedTitle =
    productTitle.length > 30 ? `${productTitle.slice(0, 30)}…` : productTitle;

  const categoryDisplay = category
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <Breadcrumb data-ocid="product.breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/category/$categorySlug"
              params={{ categorySlug: category }}
              className="text-muted-foreground hover:text-foreground transition-colors capitalize"
              data-ocid="product.breadcrumb_category.link"
            >
              {categoryDisplay}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-foreground font-medium">
            {truncatedTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
