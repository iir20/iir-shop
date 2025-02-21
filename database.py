import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('futureshop.db')
        self.create_tables()

    def create_tables(self):
        # Create tables for products, bids, users, orders
        pass

    def get_featured_products(self):
        # Return featured products
        pass