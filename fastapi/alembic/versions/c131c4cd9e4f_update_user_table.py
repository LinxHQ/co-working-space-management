"""update user table

Revision ID: c131c4cd9e4f
Revises: 09578c0b848c
Create Date: 2024-04-11 17:49:21.806875

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c131c4cd9e4f'
down_revision = '09578c0b848c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('id', table_name='reports')
    op.drop_table('reports')
    op.add_column('users', sa.Column('username', sa.String(length=100), nullable=True))
    op.drop_column('users', 'name')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('name', mysql.VARCHAR(length=100), nullable=True))
    op.drop_column('users', 'username')
    op.create_table('reports',
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('title', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('content', mysql.TEXT(), nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_default_charset='utf8',
    mysql_engine='InnoDB'
    )
    op.create_index('id', 'reports', ['id'], unique=True)
    # ### end Alembic commands ###
