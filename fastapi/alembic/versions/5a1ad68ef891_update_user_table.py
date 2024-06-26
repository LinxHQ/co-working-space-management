"""update user table

Revision ID: 5a1ad68ef891
Revises: c131c4cd9e4f
Create Date: 2024-04-11 17:50:02.618763

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '5a1ad68ef891'
down_revision = 'c131c4cd9e4f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('password_hash', sa.String(length=100), nullable=True))
    op.drop_column('users', 'password')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('password', mysql.VARCHAR(length=100), nullable=True))
    op.drop_column('users', 'password_hash')
    # ### end Alembic commands ###
