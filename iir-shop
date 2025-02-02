import sqlite3
from datetime import datetime

# Database initialization
conn = sqlite3.connect('supper_shop.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                supplier TEXT,
                last_restock DATE)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS sales (
                sale_id INTEGER PRIMARY KEY,
                sale_date DATETIME NOT NULL,
                total_amount REAL NOT NULL)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS sale_items (
                item_id INTEGER PRIMARY KEY,
                sale_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                price REAL,
                FOREIGN KEY(sale_id) REFERENCES sales(sale_id),
                FOREIGN KEY(product_id) REFERENCES products(product_id))''')

cursor.execute('''CREATE TABLE IF NOT EXISTS invoices (
                invoice_id INTEGER PRIMARY KEY,
                customer_name TEXT,
                total_amount REAL NOT NULL,
                date_issued DATETIME NOT NULL,
                payment_status TEXT DEFAULT 'UNPAID')''')

conn.commit()

class POSSystem:
    def __init__(self):
        self.current_cart = []

    def add_to_cart(self, product_id, quantity):
        cursor.execute("SELECT * FROM products WHERE product_id=?", (product_id,))
        product = cursor.fetchone()
        if product:
            if product[3] >= quantity:
                self.current_cart.append({
                    'product_id': product_id,
                    'name': product[1],
                    'price': product[2],
                    'quantity': quantity
                })
                print(f"Added {quantity} x {product[1]} to cart")
            else:
                print("Insufficient stock!")
        else:
            print("Product not found!")

    def process_sale(self):
        if not self.current_cart:
            print("Cart is empty!")
            return

        total = sum(item['price'] * item['quantity'] for item in self.current_cart)
        sale_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Record sale
        cursor.execute("INSERT INTO sales (sale_date, total_amount) VALUES (?, ?)",
                      (sale_date, total))
        sale_id = cursor.lastrowid
        
        # Record sale items and update inventory
        for item in self.current_cart:
            cursor.execute("INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                          (sale_id, item['product_id'], item['quantity'], item['price']))
            
            # Update inventory
            cursor.execute("UPDATE products SET quantity = quantity - ? WHERE product_id=?",
                          (item['quantity'], item['product_id']))
        
        conn.commit()
        self.current_cart = []
        print(f"Sale processed successfully! Total: ${total:.2f}")
        return sale_id

class InventoryManager:
    def add_product(self, name, price, quantity, supplier):
        cursor.execute("INSERT INTO products (name, price, quantity, supplier, last_restock) VALUES (?, ?, ?, ?, ?)",
                      (name, price, quantity, supplier, datetime.now().date()))
        conn.commit()
        print("Product added successfully!")

    def restock_product(self, product_id, quantity):
        cursor.execute("UPDATE products SET quantity = quantity + ?, last_restock=? WHERE product_id=?",
                      (quantity, datetime.now().date(), product_id))
        conn.commit()
        print("Restock completed!")

    def get_low_stock(self, threshold=10):
        cursor.execute("SELECT * FROM products WHERE quantity < ?", (threshold,))
        return cursor.fetchall()

class BillingSystem:
    def create_invoice(self, customer_name, items):
        total = sum(item['price'] * item['quantity'] for item in items)
        invoice_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        cursor.execute("INSERT INTO invoices (customer_name, total_amount, date_issued) VALUES (?, ?, ?)",
                      (customer_name, total, invoice_date))
        invoice_id = cursor.lastrowid
        conn.commit()
        return invoice_id

    def mark_paid(self, invoice_id):
        cursor.execute("UPDATE invoices SET payment_status='PAID' WHERE invoice_id=?", (invoice_id,))
        conn.commit()

def main_menu():
    print("\nSupper Shop Management System")
    print("1. Process Sale")
    print("2. Manage Inventory")
    print("3. Create Invoice")
    print("4. Exit")

if __name__ == "__main__":
    pos = POSSystem()
    inventory = InventoryManager()
    billing = BillingSystem()

    while True:
        main_menu()
        choice = input("Enter your choice: ")

        if choice == '1':
            while True:
                product_id = input("Enter product ID (or 0 to finish): ")
                if product_id == '0':
                    break
                quantity = int(input("Enter quantity: "))
                pos.add_to_cart(int(product_id), quantity)
            pos.process_sale()

        elif choice == '2':
            print("\nInventory Management:")
            print("1. Add New Product")
            print("2. Restock Product")
            print("3. View Low Stock")
            sub_choice = input("Enter choice: ")
            
            if sub_choice == '1':
                name = input("Product name: ")
                price = float(input("Price: "))
                quantity = int(input("Initial quantity: "))
                supplier = input("Supplier: ")
                inventory.add_product(name, price, quantity, supplier)
                
            elif sub_choice == '2':
                product_id = input("Product ID: ")
                quantity = int(input("Restock quantity: "))
                inventory.restock_product(product_id, quantity)
                
            elif sub_choice == '3':
                low_stock = inventory.get_low_stock()
                for product in low_stock:
                    print(f"{product[1]} - {product[3]} remaining")

        elif choice == '3':
            customer_name = input("Customer name: ")
            items = []
            while True:
                product_id = input("Enter product ID (or 0 to finish): ")
                if product_id == '0':
                    break
                quantity = int(input("Enter quantity: "))
                cursor.execute("SELECT price FROM products WHERE product_id=?", (product_id,))
                price = cursor.fetchone()[0]
                items.append({'product_id': product_id, 'price': price, 'quantity': quantity})
            invoice_id = billing.create_invoice(customer_name, items)
            print(f"Invoice created! Invoice ID: {invoice_id}")

        elif choice == '4':
            conn.close()
            print("Exiting system...")
            break

        else:
            print("Invalid choice!")
