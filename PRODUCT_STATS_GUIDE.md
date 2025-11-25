# Guide - Statistiques Produits Dynamiques

## Hook useProductStats()

### Import
```javascript
import { useProductStats } from '../../hooks/useProductStats';
```

### Utilisation dans Products.jsx
```javascript
const Products = () => {
  const stats = useProductStats();
  
  // Remplacer les statistiques statiques par:
  return (
    <div className="stat-product">
      <div className="stat-box">
        <h3>Total Produits</h3>
        <p>{stats.totalProducts}</p>
      </div>

      <div className="stat-box">
        <h3>En stock</h3>
        <p>{stats.inStock}</p>
      </div>

      <div className="stat-box">
        <h3>Rupture</h3>
        <p>{stats.outOfStock}</p>
      </div>

      <div className="stat-box">
        <h3>Valeur du stock</h3>
        <p>{stats.stockValue}€</p>
      </div>
    </div>
  );
};
```

## Statistiques Disponibles

| Propriété | Description | Exemple |
|-----------|-------------|---------|
| `totalProducts` | Nombre total de produits | 150 |
| `inStock` | Produits en stock (stock > 0) | 78 |
| `outOfStock` | Produits en rupture (stock = 0) | 10 |
| `stockValue` | Valeur totale du stock (prix × stock) | 25000€ |
| `lowStock` | Produits avec stock faible (≤ 10) | 15 |
| `averagePrice` | Prix moyen des produits | 45.50€ |

## Calculs Automatiques

✅ **Mise à jour automatique** quand les produits changent
✅ **Performance optimisée** avec useMemo
✅ **Gestion des cas vides** (produits = null/undefined)
✅ **Calculs précis** avec arrondi pour les prix

## Remplacement dans votre code

### Avant (statique)
```javascript
<p>78</p>  // En stock
<p>10</p>  // Rupture  
<p>10€</p> // Valeur stock
```

### Après (dynamique)
```javascript
<p>{stats.inStock}</p>
<p>{stats.outOfStock}</p>
<p>{stats.stockValue}€</p>
```

Aucune modification de votre code existant nécessaire, juste importer le hook et utiliser `stats.propriété`.