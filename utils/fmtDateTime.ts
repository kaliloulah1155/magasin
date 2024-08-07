export function formatDateTime(dateString: string | null | undefined): string {
    // Vérifie si la date est vide ou invalide
    if (!dateString) {
      return '';
    }
  
    // Convertir la chaîne de date en objet Date
    const date = new Date(dateString);
  
    // Vérifier si la conversion en objet Date a échoué
    if (isNaN(date.getTime())) {
      return '';
    }
  
    // Formater la date en JJ/MM/AAAA
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    // Formater l'heure, les minutes et les secondes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    // Retourner la date et l'heure formatées
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  